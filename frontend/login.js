const form = document.querySelector("#login-form");

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form); //패스워드 값을 가져와서
  const sha256Password = sha256(formData.get("password")); //암호화 후
  formData.set("password", sha256Password); //다시 패스워드 값에 넣고

  //값을 서버로 보냄
  const res = await fetch("/login", {
    method: "post",
    body: formData,
  });
  const data = await res.json();
  const accessToken = data.access_token; //데이터에서 받아온 access_token으로 업데이트
  window.localStorage.setItem("token", accessToken);
  alert("로그인되었습니다.");

  window.location.pathname = "/";
};

form.addEventListener("submit", handleSubmit);
