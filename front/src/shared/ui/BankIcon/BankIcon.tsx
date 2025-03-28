// interface Props {
//   bank:
//     | "시티은행"
//     | "대구은행"
//     | "광주은행"
//     | "기업은행"
//     | "한국은행"
//     | "농협은행"
//     | "산업은행"
//     | "SC제일은행"
//     | "우리은행"
//     | "국민은행";
// }

const BankIcon = () => {
  // const mapping = {
  //   시티은행: "citybank",
  //   대구은행: "daegubank",
  //   광주은행: "wangjoobank",
  //   기업은행: "ibkbank",
  //   한국은행: "koreabank",
  //   농협은행: "nonghyeopbank",
  //   산업은행: "sannupbank",
  //   SC제일은행: "scbank",
  //   우리은행: "wooribank",
  //   국민은행: "kbbank",
  // };

  //_sprite.svg#${mapping[bank]}
  return <div className="w-12 h-12 rounded-lg bg-gray-300"></div>;
};

export default BankIcon;
