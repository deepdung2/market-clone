const form = document.querySelector("#signup-form");

const checkPassword = () => {
  const formData = new FormData(form); //폼 데이터 가져옴
  const password1 = formData.get("password");
  const password2 = formData.get("password2");

  if (password1 === password2) {
    return true;
  } else return false;
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form); //패스워드 값을 가져와서
  const sha256Password = sha256(formData.get("password")); //암호화 후
  formData.set("password", sha256Password); //다시 패스워드 값에 넣고

  const div = document.querySelector("#info");

  if (checkPassword()) {
    //값을 서버로 보냄
    const res = await fetch("/signup", {
      method: "post",
      body: formData,
    });
    const data = await res.json();
    if (data === "200") {
      alert("회원가입에 성공했습니다.");
      window.location.pathname = "/login.html";
    }
  } else {
    div.innerText = "비밀번호가 동일하지 않습니다.";
    div.style.color = "red";
  }
};

form.addEventListener("submit", handleSubmit);
