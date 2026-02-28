"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { apiUrl } from "../lib/env";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      setMessage("Невірний логін або пароль");
      return;
    }

    const data = (await response.json()) as { token: string };
    localStorage.setItem("admin-token", data.token);
    window.location.href = "/admin/articles";
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" />
      <input
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Пароль"
        type="password"
      />
      <button type="submit">Увійти</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}
