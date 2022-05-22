import { Module } from "./Module";

export interface Config{
    address: string;
    basePath: string;
    port: string;
    timeFormat: number;
    units: string;
    language: string;
    locale: string;
    useHttps: boolean;
    httpsCertificate: string;
    ipWhitelist: string[];
    logLevel: string[];
    modules: Module[];
}