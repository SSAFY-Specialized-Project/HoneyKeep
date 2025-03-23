import { BasicInput } from "@/shared/ui";
import RegisterInput from "@/shared/ui/RegisterInput/RegisterInput";
import { useRef, useState } from "react";

const Login = () => {
  const [value, setValue] = useState<string>("");
  const registerRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <BasicInput
        id="email"
        name="email"
        type="email"
        label="이메일"
        value={"value"}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
      <BasicInput
        id="name"
        name="name"
        type="text"
        label="이름"
        value={"value"}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
      <RegisterInput
        value={value}
        ref={registerRef}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
    </div>
  );
};

export default Login;
