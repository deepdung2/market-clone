<script>
  import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
  import { user$ } from "../store";

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      user$.set(user); //user 정보 업데이트
      localStorage.setItem("token", token); //로그인 되면 로컬 스토리지에 저장됨
    } catch (error) {
      console.error(error);
    }
  };
</script>

<div>
  <div>로그인하기</div>
  <button class="login-btn" on:click={loginWithGoogle}>
    <img
      class="google-img"
      src="data:image/png;base64,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"
      alt=""
    />
    <div>Google로 시작하기</div>
  </button>
</div>

<style>
  .login-btn {
    width: 200px;
    height: 50px;
    border: 1px solid gray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-radius: 3px;
  }
  .google-img {
    width: 20px;
  }
</style>
