import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function chousei(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    // ここはテスト用に一旦固定のJSONを返します。これが動けばスクレイピングコードに差し替えます。
    return {
        jsonBody: {
            message: "APIは正常に動いています！",
            status: "Success"
        }
    };
};

app.http('chousei', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: chousei
});