import { NextRequest, NextResponse } from "next/server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export async function GET(request: NextRequest) {
  try {
    // Get user_id from query parameters (sent from client)
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
        name: "dashboard-stats-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );

    await client.connect(transport);

    // Use the new get_student_info tool
    const result = (await client.callTool({
      name: "get_student_info",
      arguments: {
        student_id: userId,
      },
    })) as CallToolResult;

    await client.close();

    // Parse the result content
    const content = result.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response format from MCP tool");
    }

    const studentInfo = JSON.parse(content.text);

    return NextResponse.json({
      enrolledCoursesCount: studentInfo.enrolled_courses_count,
      enrolledUnits: studentInfo.enrolled_units,
      maxUnits: studentInfo.max_units,
      remainingUnits: studentInfo.remaining_units,
      enrolledCourses: studentInfo.enrolled_courses,
      availableCoursesCount: studentInfo.total_available_courses,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
