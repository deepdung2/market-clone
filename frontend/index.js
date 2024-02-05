const calcTime = (timestamp) => {
  //현재 시간 가져옴 (한국 시간 UTC + 9 = 세계 시간)
  const curTime = new Date().getTime() - 9 * 60 * 60 * 1000; //9시간*60분*60초*밀리세컨드단위니까 1000 빼 주면 한국 시간으로 측정됨
  const time = new Date(curTime - timestamp); //시간의 관련된 값으로 묶어주기 위해 new Date로 묶음
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  if (hour > 0) return `${hour}시간 전`;
  else if (minute > 0) return `${minute}분 전`;
  else if (second > 0) return `${second}초 전`;
  else "방금 전";
};

const renderData = (data) => {
  const main = document.querySelector("main");
  //reverse() 사용해서 최근에 올린 글이 가장 위로 올라오게 함
  data.reverse().forEach(async (obj) => {
    const div = document.createElement("div");
    div.className = "item-list";

    const imgDiv = document.createElement("div");
    imgDiv.className = "item-list__img";

    const img = document.createElement("img");
    const res = await fetch(`/images/${obj.id}`); //리스폰 받아옴
    const blob = await res.blob(); //블롭 타입으로 받아옴
    const url = URL.createObjectURL(blob); //자바스크립트에서 블롭 이미지 다루는 법
    img.src = url;

    const InfoDiv = document.createElement("div");
    InfoDiv.className = "item-list__info";

    const InfoTitleDiv = document.createElement("div");
    InfoTitleDiv.className = "item-list__info-title";
    InfoTitleDiv.innerText = obj.title;

    const InfoMetaDiv = document.createElement("div");
    InfoMetaDiv.className = "item-list__info-meta";
    InfoMetaDiv.innerText = obj.place + " " + calcTime(obj.insertAt);

    const InfoPriceDiv = document.createElement("div");
    InfoPriceDiv.className = "item-list__info-price";
    InfoPriceDiv.innerText = obj.price;

    InfoDiv.appendChild(InfoTitleDiv);
    InfoDiv.appendChild(InfoMetaDiv);
    InfoDiv.appendChild(InfoPriceDiv);
    imgDiv.appendChild(img);
    div.appendChild(imgDiv);
    div.appendChild(InfoDiv);
    main.appendChild(div);
  });
};

const fetchList = async () => {
  const res = await fetch("/items");
  const data = await res.json();
  renderData(data); //데이터 받아옴
};

fetchList(); //함수 호출 해 주기
