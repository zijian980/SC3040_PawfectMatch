from enum import Enum


class Status(Enum):
    Pending = "pending"
    Cancelled = "cancelled"
    Accepted = "accepted"
    Declined = "declined"
    PendingPayment = "pendingpayment"
    Completed = "completed"
