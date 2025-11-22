import { NextRequest, NextResponse } from "next/server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Create MCP client
    const transport = new StdioClientTransport({
      command: "node",
      args: ["C:\\xampp\\htdocs\\mcp-msuenrollment\\dist\\index.js"],
      env: {
        MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
        MYSQL_USER: process.env.MYSQL_USER || "root",
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || "",
        MYSQL_DATABASE: process.env.MYSQL_DATABASE || "msuenrollment",
      },
    });

    const client = new Client(
      {
        name: "dashboard-available-courses-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );

    await client.connect(transport);

    // 1. Get eligible courses
    const eligibleResult = (await client.callTool({
      name: "check_eligible_courses",
      arguments: {
        student_id: userId,
      },
    })) as CallToolResult;

    const eligibleContent = eligibleResult.content[0];
    if (eligibleContent.type !== "text") {
      await client.close();
      throw new Error("Unexpected response format from check_eligible_courses");
    }

    const eligibleData = JSON.parse(eligibleContent.text);
    const eligibleCourses = eligibleData.eligible_courses;

    if (!eligibleCourses || eligibleCourses.length === 0) {
      await client.close();
      return NextResponse.json({ availableCourses: [] });
    }

    // 2. Get sections for eligible courses
    const courseIds = eligibleCourses.map((c: any) => c.id).join(",");

    const sectionsResult = (await client.callTool({
      name: "list_sections",
      arguments: {
        course_ids: courseIds,
      },
    })) as CallToolResult;

    await client.close();

    const sectionsContent = sectionsResult.content[0];
    if (sectionsContent.type !== "text") {
      throw new Error("Unexpected response format from list_sections");
    }

    const sectionsData = JSON.parse(sectionsContent.text);

    // 3. Merge data
    // Create a map of course_id -> sections
    const sectionsByCourse = new Map();
    sectionsData.forEach((section: any) => {
      if (!sectionsByCourse.has(section.course_id)) {
        sectionsByCourse.set(section.course_id, []);
      }
      sectionsByCourse.get(section.course_id).push(section);
    });

    // Attach sections to courses
    const coursesWithSections = eligibleCourses.map((course: any) => ({
      ...course,
      sections: sectionsByCourse.get(course.id) || [],
    }));

    return NextResponse.json({ availableCourses: coursesWithSections });
  } catch (error) {
    console.error("Error fetching available courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch available courses" },
      { status: 500 }
    );
  }
}
