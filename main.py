from fastapi import FastAPI,UploadFile,Form,Response,Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from typing import Annotated
import sqlite3

con = sqlite3.connect('db.db',check_same_thread=False)
cur = con.cursor()

cur.execute(f"""
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                image BLOB,
                price INTEGER NOT NULL,
                description TEXT,
                place TEXT NOT NULL,
                insertAt INTEGER NOT NULL
            );
            """) # IF NOT EXISTS = 테이블이 없을 때만 생성하게 되는 SQL문

app = FastAPI()

SECRET = "super-coding"
manager = LoginManager(SECRET, '/login') #token이 로그인에서만 발급되도록 함

@manager.user_loader() #로그인 매니저가 키를 같이 조회
def query_user(data):
    WHERE_STATEMENTS = f'id="{data}"'
    if type(data) == dict:
        WHERE_STATEMENTS = f'id="{data['id']}"'
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    #해당 유저가 DB에 존재하는지 조회
    user = cur.execute(f"""
                       SELECT * from users WHERE {WHERE_STATEMENTS}
                       """).fetchone()
    return user 

@app.post('/login')
def login(id:Annotated[str,Form()], 
          password:Annotated[str,Form()]):
    user = query_user(id) #query user를 통해 id 받아옴
    if not user:
        raise InvalidCredentialsException #유효하지 않은 계정에 대한 에러 처리하는 문법
    elif password != user['password']:
        raise InvalidCredentialsException #401을 자동으로 생성해서 내려줌
    
    access_token = manager.create_access_token(data={
        'sub': {
            'id':user['id'],
            'name':user['name'],
            'email':user['email']
        }
    })
    
    return {'access_token':access_token} #200으로 지정하지않아도 자동으로 200 코드 내려줌

@app.post('/signup') #새로운 회원가입을 시켜달라는 요청이니까 post
def signup(id:Annotated[str,Form()], 
           password:Annotated[str,Form()],
           name:Annotated[str,Form()],
           email:Annotated[str,Form()]):
    cur.execute(f"""
                INSERT INTO users(id,name,email,password)
                VALUES ('{id}','{name}','{email}','{password}')
                """) #DB에 저장
    con.commit()
    return '200'

@app.post('/items')
async def create_item(image:UploadFile, 
                title:Annotated[str,Form()], #title 정보는 form data 형식으로 문자열로 옴 
                price:Annotated[int,Form()], 
                description:Annotated[str,Form()], 
                place:Annotated[str,Form()],
                insertAt:Annotated[str,Form()],
                user=Depends(manager)
                ): #타입을 지졍해 줘야 함
    
    image_bytes = await image.read() #image 파일은 크기 때문에 읽는 시간 필요
    
    #테이블 작성
    cur.execute(f"""
                INSERT INTO
                items(title,image,price,description,place,insertAt)
                VALUES ('{title}','{image_bytes.hex()}',{price},'{description}','{place}',{insertAt})
                """) #파이썬에서 변수 넣을 때 쓰는 f문자열
    con.commit()
    return '200'

#items를 보내 줌
@app.get('/items')
async def get_items(user=Depends(manager)): #유저가 인증된 상태에서만 응답을 보낼 수 있게 설정
    con.row_factory = sqlite3.Row #컬럼명도 같이 가져오는 문법
    cur = con.cursor() #DB를 가져오면서 위치를 업데이트해 줘야 함
    rows = cur.execute(f"""
                       SELECT * from items;
                       """).fetchall() #가져오는 문법이니까 fetchall 써줌
    
    return JSONResponse(jsonable_encoder(dict(row) for row in rows))

@app.get('/images/{item_id}') #item에 맞는 id를 보내줌
async def get_image(item_id):
    cur = con.cursor()
    # 16진법
    image_bytes = cur.execute(f"""
                              SELECT image from items WHERE id = {item_id}
                              """).fetchone()[0] #특정 id에 맞는 이미지만 가져오기
    #16진법으로 된 것을 2진법으로 바꿔서 리스폰
    return Response(content=bytes.fromhex(image_bytes), media_type = 'image/*')
    
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
