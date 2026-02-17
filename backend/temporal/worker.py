import asyncio
from temporalio.client import Client
from temporalio.worker import Worker
from src.workflows.sales_agent_workflow import SalesAgentWorkflow
from src.activities.sales_activities import (
    llm_reason_activity,
    execute_tool_activity,
    check_opa_activity,
    calculate_roi_activity,
)


async def main():
    client = await Client.connect("localhost:7233")
    worker = Worker(
        client,
        task_queue="forgefabric-queue",
        workflows=[SalesAgentWorkflow],
        activities=[
            llm_reason_activity,
            execute_tool_activity,
            check_opa_activity,
            calculate_roi_activity,
        ],
    )
    print("Temporal worker started on forgefabric-queue")
    await worker.run()


if __name__ == "__main__":
    asyncio.run(main())