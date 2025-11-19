"use client";

import Link from "next/link";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";

type ActiveTab = "username" | "password";

export function ForgotCredentials() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("username");
  const [idEmail, setIdEmail] = useState("");
  const [pwEmail, setPwEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const changeTab = (next: ActiveTab) => {
    setActiveTab(next);
  };

  const handleIdSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("아이디 안내 메일을 발송했어요.", {
        description:
          "입력하신 이메일로 등록된 아이디를 안내해 드렸습니다. 메일함을 확인해주세요.",
      });
      setIdEmail("");
    } catch (error) {
      toast.error("아이디를 찾지 못했어요. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("비밀번호 재설정 링크를 보냈어요.", {
        description:
          "입력하신 이메일로 비밀번호 재설정 링크를 전송했습니다. 10분 이내에 확인해주세요.",
      });
      setPwEmail("");
    } catch (error) {
      toast.error("재설정 링크를 발송하지 못했어요. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const tabButtonClass = (tab: ActiveTab) =>
    [
      "flex-1 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors",
      activeTab === tab
        ? "border-primary bg-primary/10 text-primary"
        : "border-border text-muted-foreground hover:text-foreground",
    ].join(" ");

  return (
    <div className="w-full max-w-2xl space-y-6 mx-auto">
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          가입 당시 입력한 정보를 알려주시면 빠르게 도와드릴게요.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
        <div className="flex items-start gap-3 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
          <MailCheck className="h-5 w-5 shrink-0" aria-hidden />
          <p>
            입력하신 정보와 일치하는 계정이 확인되면
            <span className="font-semibold"> 등록된 이메일로 안내</span>가 전달돼요.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={tabButtonClass("username")}
            onClick={() => changeTab("username")}
          >
            아이디 찾기
          </button>
          <button
            type="button"
            className={tabButtonClass("password")}
            onClick={() => changeTab("password")}
          >
            비밀번호 재설정
          </button>
        </div>

        {activeTab === "username" ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              등록된 이메일을 입력해 주세요. 해당 이메일로 연결된 아이디를 안내해 드립니다.
            </p>
            <form className="space-y-4" onSubmit={handleIdSubmit}>
              <div>
                <label
                  htmlFor="findEmail"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  등록된 이메일
                </label>
                <input
                  id="findEmail"
                  name="email"
                  type="email"
                  value={idEmail}
                  onChange={(e) => setIdEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="form-input mt-1"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-70"
              >
                {submitting ? "확인 중..." : "아이디 안내 메일 받기"}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              비밀번호 재설정 링크를 받고 싶은 이메일을 입력해 주세요.
            </p>
            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <div>
                <label
                  htmlFor="resetEmail"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  등록된 이메일
                </label>
                <input
                  id="resetEmail"
                  name="email"
                  type="email"
                  value={pwEmail}
                  onChange={(e) => setPwEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="form-input mt-1"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-70"
              >
                {submitting ? "요청 중..." : "재설정 링크 받기"}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        아이디와 비밀번호가 생각났다면{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          로그인하기
        </Link>
      </div>
    </div>
  );
}
