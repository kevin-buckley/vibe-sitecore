import { generateUUID } from "@/utils.js";
import { convertObject, parseXMLString } from "@antonytm/clixml-parser";
import { PowershellCommandBuilder } from "./command-builder.js";

class PowershellClient {
    private serverUrl: string;
    private username: string;
    private password: string;
    private domain: string;
    private bearertoken: string | null = null;
    private commandBuilder: PowershellCommandBuilder = new PowershellCommandBuilder();

    constructor(serverUrl: string, username: string, password: string, domain: string = 'sitecore') {
        this.serverUrl = serverUrl;
        this.username = username;
        this.password = password;
        this.domain = domain;
        this.bearertoken = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
    }

    async executeScriptRaw(script: string, parameters: Record<string, any> = {}): Promise<string> {
        const uuid = generateUUID();
        const url = `${this.serverUrl}/-/script/script/?sessionId=${uuid}&rawOutput=True&persistentSession=False`;
        const headers = {
            'Authorization': this.bearertoken || '',
            'Content-Type': 'application/json',
        };
        const scriptWithParameters = this.commandBuilder.buildCommandString(script, parameters);
        const body = `${scriptWithParameters}\r\n <#${uuid}#>\r\n`;
        const response = await fetch(url, { method: 'POST', headers, body });
        if (!response.ok) {
            throw new Error(`Error executing script: ${response.statusText}`);
        }
        return response.text();
    }

    async executeScript(script: string, parameters: Record<string, any> = {}): Promise<any> {
        const uuid = generateUUID();
        const url = `${this.serverUrl}/-/script/script/?sessionId=${uuid}&rawOutput=False&persistentSession=False`;
        const headers = {
            'Authorization': this.bearertoken || '',
            'Content-Type': 'application/json',
        };

        const scriptWithParameters = this.commandBuilder.buildCommandString(script, parameters);
        const body = `${scriptWithParameters}\r\n <#${uuid}#>\r\n`;
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,

        });

        if (!response.ok) {
            throw new Error(`Error executing script: ${response.statusText}`);
        }
        return response.text();
    }

    async executeScriptJson(script: string, parameters: Record<string, any> = {}): Promise<any> {
        return this.executeScript(script, parameters).then((text) => {
            const json = parseXMLString(text
                .trim("'")
                .trim('"')
                .replaceAll("\\\"", "\""));
            return JSON.stringify(convertObject(json));
        });
    }
}

export { PowershellClient };