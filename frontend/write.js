const form = document.getElementById("write-form");

const handleSubmitForm = async (event) => {
  event.preventDefault(); //submit 이벤트가 리로드 되는 동작을 막아줌
  const body = new FormData(form);
  //세계 시간 기준으로
  body.append("insertAt", new Date().getTime()); //타임스템프 넣어줌
  //await 구문 이용해서 서버에 요청 보낼 때, try-catch문을 이용하여 에러 처리하는 방법
  try {
    const res = await fetch("/items", {
      method: "POST",
      body, //body:body, 동일하게 인식
    });
    const data = await res.json();
    if (data === "200") window.location.pathname = "/"; //업로드 성공하면 메인 화면으로 돌아옴
  } catch (error) {
    console.error(error);
  }
};

form.addEventListener("submit", handleSubmitForm);
