/*
MIT License

Copyright (c) 2019 - 2022 Lilly Rose Berner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { Environment, HTTPError } from "..";

export const onRequest: PagesFunction<Environment> = async ({ next }) => {
  try {
    const response = await next();

    // Adding CORS headers to the response
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return response;
  } catch (e) {
    if (!(e instanceof HTTPError)) {
      throw e;
    }

    const json = { message: e.message };
    const headers = {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json; charset=UTF-8",
      "Access-Control-Allow-Origin": "*", // Add CORS header in error response
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Add allowed methods
      "Access-Control-Allow-Headers": "Content-Type, Authorization" // Add allowed headers
    };

    const data = JSON.stringify(json);
    return new Response(data, { headers, status: e.status });
  }
};
