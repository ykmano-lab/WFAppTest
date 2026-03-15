import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

export async function chousei(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const targetUrl = "https://chouseisan.com/s?h=fac9b2a726094d2d91a1825552de4448"; // 取得したいURL
    
    // 1. ページを取得
    const response = await fetch(targetUrl);
    const html = await response.text();
    
    // 2. 解析（スクレイピング）
    const $ = cheerio.load(html);
    const title = $("h1").text(); // 例えばタイトルを抜く

    return {
        jsonBody: {
            eventTitle: title,
            message: "本物のデータを取得しました！"
        }
    };
};

app.http('chousei', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: chousei
});