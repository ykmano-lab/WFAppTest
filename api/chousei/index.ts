import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as cheerio from "cheerio";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const url = "https://chouseisan.com/s?h=fac9b2a726094d2d91a1825552de4448";

    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        // 日付一覧を取得
        const dates: string[] = [];
        $(".schedule_table thead th").each((i, el) => {
            const text = $(el).text().trim();
            if (text && text !== "日程") dates.push(text);
        });

        // 参加者と出欠を取得
        const members: string[] = [];
        const matrix: string[][] = [];
        $(".schedule_table tbody tr").each((i, row) => {
            const name = $(row).find("th").text().trim();
            if (name) {
                members.push(name);
                const rowData: string[] = [];
                $(row).find("td").each((j, cell) => {
                    rowData.push($(cell).text().trim());
                });
                matrix.push(rowData);
            }
        });

        context.res = {
            status: 200,
            body: { dates, members, matrix }
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: "データの取得に失敗しました"
        };
    }
};

export default httpTrigger;