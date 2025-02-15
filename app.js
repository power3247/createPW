// document.addEventListener("DOMContentLoaded", function () {
//   const maxHistory = 5;
//   let passwordHistory = [];

document.addEventListener("DOMContentLoaded", function () {
  const maxHistory = 5;
  let passwordHistory = [];

  // 히스토리 로드
  const savedHistory = localStorage.getItem("passwordHistory");
  if (savedHistory) {
    passwordHistory = JSON.parse(savedHistory);
    updateHistoryDisplay();
  }

  function generateRandomString(length, isBarcode) {
    if (isBarcode) {
      let result = "";
      for (let i = 0; i < length; i++) {
        const randomChar =
          barcodeChars[Math.floor(Math.random() * barcodeChars.length)];
        result += randomChar;
      }
      return result;
    } else {
      const allChars = Object.values(similarChars).flat();
      let result = "";
      for (let i = 0; i < length; i++) {
        const randomChar =
          allChars[Math.floor(Math.random() * allChars.length)];
        result += randomChar;
      }
      return result;
    }
  }
  function updateHistoryDisplay() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    passwordHistory.forEach((item, index) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";
      historyItem.innerHTML = `
            <span>${item}</span>
            <button class="copy-btn" data-string="${item}">복사</button>
          `;
      historyList.appendChild(historyItem);
    });

    document.querySelectorAll(".copy-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const str = this.getAttribute("data-string");
        navigator.clipboard.writeText(str);
        this.textContent = "복사됨!";
        setTimeout(() => {
          this.textContent = "복사";
        }, 1000);
      });
    });
  }
  document.getElementById("generate").addEventListener("click", function () {
    const countInput = document.getElementById("charCount");
    const count = parseInt(countInput.value);
    const errorDiv = document.getElementById("error");
    const isBarcode = document.getElementById("barcodeMode").checked;

    // 입력값 검증
    // if (isNaN(count) || count < 1 || count > 50) {
    //   errorDiv.textContent = "1에서 50 사이의 숫자를 입력해주세요.";
    //   return;
    // }
    // errorDiv.textContent = "";

    // const generated = generateRandomString(count);
    // const resultDiv = document.getElementById("result");
    // resultDiv.textContent = generated;
    if (isNaN(count) || count < 1 || count > 50) {
      errorDiv.textContent = "1에서 50 사이의 숫자를 입력해주세요.";
      return;
    }
    errorDiv.textContent = "";

    const generated = generateRandomString(count, isBarcode);
    const resultDiv = document.getElementById("result");
    resultDiv.textContent = generated;

    // 히스토리에 추가
    passwordHistory.unshift(generated);
    if (passwordHistory.length > maxHistory) {
      passwordHistory.pop();
    }

    // 히스토리 저장 및 표시 업데이트
    localStorage.setItem("passwordHistory", JSON.stringify(passwordHistory));
    updateHistoryDisplay();

    // 자동 복사
    navigator.clipboard.writeText(generated);
  });

  // 숫자 입력 필드 제한
  document.getElementById("charCount").addEventListener("input", function (e) {
    let value = parseInt(this.value);
    if (value > 50) this.value = 50;
    if (value < 1) this.value = 1;
  });
});
