const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// .env 파일 경로 설정
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// 1. API 키 로드
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.post('/api/analyze-business', async (req, res) => {
  try {
    const { districtData, categoryMain, categorySub } = req.body;

    const model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash" },
      { apiVersion: 'v1beta' }
    );

    const prompt = `
      전문 상권 분석가로서 [${districtData.name}] (좌표: ${districtData.lat}, ${districtData.lng}) 지점의 
      반경 200m 이내 [${categorySub}] 업종 창업 적합도를 정밀 분석하세요.

      [제공 데이터]
      - 인구: ${districtData.population}명
      - 평균 임대료: ${districtData.rent}
      - 위치: 위도 ${districtData.lat}, 경도 ${districtData.lng}

      [분석 가이드라인]
      1. 종합 적합도(suitability)는 100점 만점으로 계산하되, 가중치는 **1순위: 유동인구, 2순위: 임대료, 3순위: 교통** 순으로 두십시오.
      2. population.timeSlots는 시간대별(오전, 점심, 오후, 저녁, 밤, 심야) 유동인구 활성도를 0~100 사이의 숫자 6개 배열로 생성하세요.
      3. 모든 텍스트 응답은 간결하고 전문적인 톤으로 작성하세요.

      **반드시 아래의 JSON 형식을 엄수하여 답변하세요. 주석이나 설명은 제외하고 오직 JSON만 출력하세요.**
      {
        "suitability": 숫자,
        "population": {
          "total": "${districtData.population}명",
          "mainAge": "AI가 판단한 주요 타겟 연령층과 이유",
          "genderRatio": { "male": 숫자, "female": 숫자 },
          "timeSlots": [숫자6개]
        },
        "market": {
          "avgSales": "AI 추정 월 평균 매출",
          "competition": "낮음|보통|높음|매우 높음 중 선택",
          "avgRent": "${districtData.rent}",
          "nearbySimilar": AI 추정 경쟁 업체 수
        },
        "traffic": {
          "subway": "인근 지하철 정보 분석",
          "bus": "버스 접근성 분석",
          "accessibility": "최상|우수|보통|불량 중 선택"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON 부분만 추출 (마크다운 방지)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON 파싱 실패");
    
    res.json(JSON.parse(jsonMatch[0]));

  } catch (error) {
    console.error("분석 에러:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/gemini-chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    // 1. 목록에서 확인된 최신 모델 "gemini-2.5-flash" 사용
    // 2. 최신 모델들은 v1beta 경로에서 더 안정적으로 응답합니다.
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash" },
      { apiVersion: 'v1beta' } 
    );

    let prompt;
    
    // 분석할 데이터(context)가 있고, 질문이 분석과 관련되어 보일 때만 전문가 모드 적용
    if (context && (message.includes("분석") || message.includes("어때") || message.includes("추천"))) {
      prompt = `당신은 상권 분석 전문가입니다. 아래 데이터를 바탕으로 답변하세요.
        조건으로 아래 네가지를 가지고이어야함 예외로 유저가 요수할 경우에는 조건을 무시해도 상관없음
        1. 답변은 최대 3~4문장 내외로 간결하게 요약할 것.
        2. 불필요한 서론(인사, 데이터 확인 등)은 생략하고 바로 핵심 결과부터 말할 것.
        3. 수치 데이터는 가장 중요한 1~2개만 언급할 것.
        4. 가독성을 위해 불렛포인트(•)를 사용하거나 단락을 명확히 나눌 것.
      데이터: ${JSON.stringify(context)}
      질문: ${message}`;
    } else {
      // 일반적인 대화 모드
      prompt = `당신은 친절한 AI 조수입니다. 사용자의 질문에 자연스럽게 답하세요.
      질문: ${message}`;
    }
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ reply: response.text() });

  } catch (error) {
    console.error("--- 디버깅 상세 정보 ---");
    console.error("메시지:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 작동 중입니다.`);
  console.log("연결된 .env 경로:", path.join(__dirname, '../.env'));
  console.log("API 키 로드 확인:", process.env.GEMINI_API_KEY ? "성공" : "실패");
});