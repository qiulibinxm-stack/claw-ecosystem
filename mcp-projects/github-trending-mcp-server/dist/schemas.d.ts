/**
 * GitHub Trending MCP Server - Schemas
 *
 * Zod 验证 Schema
 */
import { z } from 'zod';
export declare const ProgrammingLanguageSchema: z.ZodEnum<["python", "typescript", "javascript", "go", "rust", "java", "cpp", "c", "csharp", "ruby", "php", "swift", "kotlin", "all"]>;
export declare const TimeRangeSchema: z.ZodDefault<z.ZodEnum<["daily", "weekly", "monthly"]>>;
export declare const ResponseFormatSchema: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
export declare const ScanTrendingInputSchema: z.ZodObject<{
    languages: z.ZodDefault<z.ZodArray<z.ZodEnum<["python", "typescript", "javascript", "go", "rust", "java", "cpp", "c", "csharp", "ruby", "php", "swift", "kotlin", "all"]>, "many">>;
    timeRange: z.ZodDefault<z.ZodEnum<["daily", "weekly", "monthly"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
    response_format: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
}, "strict", z.ZodTypeAny, {
    languages: ("python" | "typescript" | "javascript" | "go" | "rust" | "java" | "cpp" | "c" | "csharp" | "ruby" | "php" | "swift" | "kotlin" | "all")[];
    timeRange: "daily" | "weekly" | "monthly";
    limit: number;
    response_format: "markdown" | "json";
}, {
    languages?: ("python" | "typescript" | "javascript" | "go" | "rust" | "java" | "cpp" | "c" | "csharp" | "ruby" | "php" | "swift" | "kotlin" | "all")[] | undefined;
    timeRange?: "daily" | "weekly" | "monthly" | undefined;
    limit?: number | undefined;
    response_format?: "markdown" | "json" | undefined;
}>;
export declare const GenerateBriefInputSchema: z.ZodObject<{
    languages: z.ZodDefault<z.ZodArray<z.ZodEnum<["python", "typescript", "javascript", "go", "rust", "java", "cpp", "c", "csharp", "ruby", "php", "swift", "kotlin", "all"]>, "many">>;
    timeRange: z.ZodDefault<z.ZodEnum<["daily", "weekly", "monthly"]>>;
    focusKeywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    response_format: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
}, "strict", z.ZodTypeAny, {
    languages: ("python" | "typescript" | "javascript" | "go" | "rust" | "java" | "cpp" | "c" | "csharp" | "ruby" | "php" | "swift" | "kotlin" | "all")[];
    timeRange: "daily" | "weekly" | "monthly";
    response_format: "markdown" | "json";
    focusKeywords?: string[] | undefined;
}, {
    languages?: ("python" | "typescript" | "javascript" | "go" | "rust" | "java" | "cpp" | "c" | "csharp" | "ruby" | "php" | "swift" | "kotlin" | "all")[] | undefined;
    timeRange?: "daily" | "weekly" | "monthly" | undefined;
    response_format?: "markdown" | "json" | undefined;
    focusKeywords?: string[] | undefined;
}>;
export type ScanTrendingInput = z.infer<typeof ScanTrendingInputSchema>;
export type GenerateBriefInput = z.infer<typeof GenerateBriefInputSchema>;
//# sourceMappingURL=schemas.d.ts.map