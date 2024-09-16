"use client";
import React, { useRef, useState, useEffect, FormEvent } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import axios from "../../api/axios";

const inputClassName =
  "text-black border rounded-md shadow-md px-2 py-1 max-w-96 w-[90vw]";
const infoClassName = "text-gray-500 border p-4 rounded-lg bg-gray-200";
const linkClassNmae = "text-sky-600 px-2 underline";

const USER_REGEX = /^[a-zA-z][a-zA-Z0-9-_]{3,23}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{4,24}$/;
const PWD_REGEX = /^[a-zA-z][a-zA-Z0-9-_]{2,23}$/;
const REGISTER_URL = "/user";

const RegisterPage = () => {
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(true);
  const [userFocus, setUserFocus] = useState(true);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(true);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(true);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (!response.data.error) {
        // console.log("try then success: ", response.data);
        setSuccess(true);
      } else {
        // console.error("try then error: ", response.data.error);
        setErrMsg(response.data.error);
        errRef.current?.focus();
      }
    } catch (err: any) {
      // console.log("catch: ", err);

      setErrMsg(err.response.data.error);
      errRef.current?.focus();
    }
  };

  return (
    <>
      {success ? (
        <section className="w-full p-4 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4 text-green-600">Success!</h1>
          <p>
            Let's go to sign in page.
            <Link href="/login" className={linkClassNmae}>
              Sign In
            </Link>
          </p>
        </section>
      ) : (
        <section className="w-full p-4 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">Register</h1>
          <p
            ref={errRef}
            className={errMsg ? "text-red-500" : "hidden"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 justify-center"
          >
            <label htmlFor="username">
              Username:
              <span className={validName ? "text-green-500" : "hidden"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validName || !user ? "hidden" : "text-red-500"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value.toUpperCase())}
              value={user}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              className={inputClassName}
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? infoClassName : "hidden"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters. <br />
              Must begin with a letter. <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
            <label htmlFor="password">
              Password:
              <span className={validPwd ? "text-green-500" : "hidden"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPwd || !pwd ? "hidden" : "text-red-500"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pidnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              className={inputClassName}
            />
            <p
              id="pidnote"
              className={pwdFocus && !validPwd ? infoClassName : "hidden"}
            >
              <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters. <br />
              must include uppercase and lowercase letters, a number and a
              special character. <br />
              allowed special characters:
              <span area-label="exclamation mark">!</span>
              <span area-label="at symbol">@</span>
              <span area-label="hashtag">#</span>
              <span area-label="dollar sign">$</span>
              <span area-lable="percent">%</span>
            </p>
            <label htmlFor="match">
              Confirm password:
              <span
                className={validMatch && matchPwd ? "text-green-500" : "hidden"}
              >
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={validMatch || !matchPwd ? "hidden" : "text-red-500"}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="match"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="midnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              className={inputClassName}
            />
            <p
              id="midnote"
              className={matchFocus && !validMatch ? "text-gray-700" : "hidden"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>
            <button
              className="p-2 bg-sky-600 rounded-md text-white shadow-md disabled:opacity-25"
              disabled={!validName || !validPwd || !validMatch ? true : false}
            >
              Sign Up
            </button>
          </form>
          <p className="mt-8 text-gray-800">
            already have an account?
            <Link href="/login" className={linkClassNmae}>
              Sign in
            </Link>
          </p>
        </section>
      )}
    </>
  );
};

export default RegisterPage;
