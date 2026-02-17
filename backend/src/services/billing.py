import stripe
import os
from pydantic import BaseModel

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")


class OutcomeBilling(BaseModel):
    thread_id: str
    outcome_value_dollars: float
    customer_email: str
    description: str = "ForgeFabric Agent Swarm Outcome Value"


async def bill_outcome(bill: OutcomeBilling) -> dict:
    if not stripe.api_key:
        return {"status": "skipped", "reason": "No Stripe key configured"}

    customers = stripe.Customer.list(email=bill.customer_email, limit=1)
    customer = customers.data[0] if customers.data else stripe.Customer.create(email=bill.customer_email)

    invoice_item = stripe.InvoiceItem.create(
        customer=customer.id,
        amount=int(bill.outcome_value_dollars * 0.05 * 100),
        currency="usd",
        description=f"{bill.description} | Thread {bill.thread_id}",
        metadata={"thread_id": bill.thread_id, "roi_value": bill.outcome_value_dollars},
    )

    invoice = stripe.Invoice.create(
        customer=customer.id,
        collection_method="send_invoice",
        days_until_due=7,
        metadata={"forgefabric_thread": bill.thread_id},
    )
    stripe.Invoice.finalize_invoice(invoice.id)

    return {
        "status": "invoiced",
        "invoice_id": invoice.id,
        "amount_billed": invoice_item.amount / 100,
        "value_share_percent": 5,
        "thread_id": bill.thread_id,
    }