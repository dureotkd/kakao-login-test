import axios from "axios";
import qs from "qs";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";

// REST API 키
const KAKAO_API_KEY = "20ab3e6f92c30d437a0fea37c27f010a";

// JavaScript 키
const KAKAO_CLIENT_ID = "9563df716994b2238ed6180304407a46";

// REDIRECT_URI
const REDIRECT_URI = "http://localhost:3000/oauth/callback/kakao";

const 카카오소셜로그인링크 = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

function Main() {
  return (
    <div
      onClick={() => {
        window.location.href = 카카오소셜로그인링크;
      }}
      style={{
        display: "inline-block",
        width: 200,
        padding: 20,
        margin: 100,
        backgroundColor: "yellow",
        cursor: "pointer",
      }}
      className="App"
    >
      카카오 로그인
    </div>
  );
}

function 카카오데이터() {
  const code = new URL(window.location.href).searchParams.get("code");

  const navigatioin = useNavigate();

  const getKAKAO = async () => {
    const data = qs.stringify({
      grant_type: "authorization_code",
      client_id: KAKAO_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: code,
      client_secret: KAKAO_CLIENT_ID,
    });

    const result = await axios({
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      data: data,
    });

    // kakao Javascript SDK 초기화
    window.Kakao.init(KAKAO_API_KEY);

    window.Kakao.Auth.setAccessToken(result.data.access_token);

    const kakaoData = await window.Kakao.API.request({
      url: "/v2/user/me",
    });

    /**
     * 1.
     *  - 우리 Node.js 호출 !
     *  - kakaData 넣어주기~
     * 2.
     *  - LocalStorage 사용
     * 3.
     *  - 전역변수 설정 LoginUser !
     */

    navigatioin("/");
  };

  React.useEffect(() => {
    getKAKAO();
  }, []);

  return <div>카카오 데이터 받는곳</div>;
}

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Main />} />
      <Route exact path="/oauth/callback/kakao" element={<카카오데이터 />} />
    </Routes>
  );
}

export default App;
