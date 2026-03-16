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
	const title = $("h1").text().trim();

	// 日程のリストを取得（表のヘッダー部分）
	const dates: string[] = [];
	$(".koa th.date").each((i, el) => {
	dates.push($(el).text().trim());
	});

	// 参加者ごとの回答を取得
	const attendance: any[] = [];
	$("#back_top tr").each((i, el) => {
	    const name = $(el).find(".name").text().trim();
	    if (!name) return; // 名前がない行（ヘッダーなど）はスキップ

	    const answers: string[] = [];
	    $(el).find("td").each((j, td) => {
	        const status = $(td).text().trim(); // ○, △, × など
	        if (status) answers.push(status);
	    });

	    attendance.push({
	        name: name,
	        answers: answers
	    });
	});
}

return {
    jsonBody: {
        eventTitle: title,
        dates: dates,        // 日付のリスト
        participants: attendance // [{name: "Aさん", answers: ["○", "×"...]}, ...]
    }
};