import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RESEARCH_RUN_ID } from "@/services/research.service";

export async function GET() {
  try {
    const databaseConfigured = !!process.env.DATABASE_URL;
    if (!databaseConfigured) {
      return NextResponse.json({
        databaseConfigured: false,
        researchRunId: RESEARCH_RUN_ID,
        runFound: false,
      });
    }

    const run = await db.researchRun.findUnique({
      where: { id: RESEARCH_RUN_ID },
    });

    if (!run) {
      return NextResponse.json({
        databaseConfigured: true,
        researchRunId: RESEARCH_RUN_ID,
        runFound: false,
      });
    }

    // counts
    const [artifacts, splitRegistry, validation, test, outliers, shap] = await Promise.all([
      db.researchArtifact.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
      db.splitRegistry.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
      db.validationMetric.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
      db.testMetric.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
      db.outlierDetail.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
      db.shapGlobalImportance.count({ where: { researchRunId: RESEARCH_RUN_ID } }),
    ]);

    return NextResponse.json({
      databaseConfigured: true,
      researchRunId: RESEARCH_RUN_ID,
      runFound: true,
      counts: {
        artifacts,
        splitRegistry,
        validation,
        test,
        outliers,
        shap,
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Strip any potential connection strings from the error message
    const safeMessage = message.replace(/postgresql:\/\/[^@]+@[^/]+\/[^\s"']*/gi, '[REDACTED]');
    console.error('[research-health] error:', safeMessage);
    return NextResponse.json(
      {
        databaseConfigured: !!process.env.DATABASE_URL,
        researchRunId: RESEARCH_RUN_ID,
        runFound: false,
        error: safeMessage,
      },
      { status: 500 }
    );
  }
}
