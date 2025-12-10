import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
  type MouseEvent,
  type ReactNode,
} from "react"
import { fetchDashboardSnapshot } from "../api/mockapi"
import type { BookingSummary, DashboardSnapshot } from "../api/mockapi"
import "./Dashboard.css"
import { ChevronRight, CalendarPlus, CalendarCheck2, Info, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import { useUser } from "@/context/UserContext"
import type { TBookings, TBooking } from "@/api/booking/types"
import { BookingAPI } from "@/api"
import { formatDateTime } from "@/utils/formatDateTime"

type BookingStatus = BookingSummary["status"]

const formatCurrency = (amount: number, currency: string): string =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)

interface CardProps {
  readonly title: string
  readonly subtitle?: string
  readonly description?: string
  readonly action?: ReactNode
  readonly children?: ReactNode
  readonly icon?: ReactNode
}

const statusClassNames: Record<BookingStatus, string> = {
  Confirmed: "statusPill statusConfirmed",
  Pending: "statusPill statusPending",
}

const Card: FC<CardProps> = ({ title, subtitle, description, action, children, icon }) => (
  <section className="card">
    <header className="cardHeader">
      <div className="cardTitleRow">
        {icon ? <span className="cardIcon">{icon}</span> : null}
        <h2 className="cardTitle">{title}</h2>
      </div>
      {subtitle ? <p className="cardSubtitle">{subtitle}</p> : null}
    </header>
    {description ? <p className="cardDescription">{description}</p> : null}
    {children}
    {action}
  </section>
)

interface HoverButtonProps {
  readonly label: string
  readonly icon?: ReactNode
  readonly onClick?: () => void
}

const HoverButton: FC<HoverButtonProps> = ({ label, icon, onClick }) => (
  <button type="button" className="ctaButton" onClick={onClick}>
    <span>{label}</span>
    {icon}
  </button>
)

const LOADING_BOOKINGS_MESSAGE = "Loading bookings…"
const EMPTY_BOOKINGS_MESSAGE = "No bookings to display yet."

interface BookingRowProps {
  readonly booking: TBooking
  readonly rowClassName: string
  readonly textClassName: string
}

const BookingRow: FC<BookingRowProps> = ({ booking, rowClassName, textClassName }) => (
  <div className={rowClassName}>
    <div className={textClassName}>
      <span className="listTime">{formatDateTime(booking.date)}</span>
      <span className="listService">{booking.offered_service.service.name}</span>
    </div>
    <span className={statusClassNames["Pending"]}>{booking.status}</span>
  </div>
)

interface BookingListProps {
  readonly bookings: TBookings
  readonly isLoading: boolean
  readonly limit?: number
  readonly containerClassName: string
  readonly rowClassName: string
  readonly textClassName: string
  readonly emptyMessage?: string
}

const BookingList: FC<BookingListProps> = ({
  bookings,
  isLoading,
  limit,
  containerClassName,
  rowClassName,
  textClassName,
  emptyMessage = EMPTY_BOOKINGS_MESSAGE,
}) => {
  const items = useMemo(
    () => (limit != null ? bookings.slice(0, limit) : bookings),
    [bookings, limit],
  )

  if (isLoading && items.length === 0) {
    return <p className="subtleHint">{LOADING_BOOKINGS_MESSAGE}</p>
  }

  if (items.length === 0) {
    return <p className="subtleHint">{emptyMessage}</p>
  }

  return (
    <div className={containerClassName}>
      {items.map((booking) => (
        <BookingRow
          key={`${booking.date}-${booking.offered_service.service.name}`}
          booking={booking}
          rowClassName={rowClassName}
          textClassName={textClassName}
        />
      ))}
    </div>
  )
}

const Dashboard = () => {
  const { user } = useUser()
  const [bookings, setBookings] = useState<TBookings>([])
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let isActive = true

    BookingAPI.fetchBookings().then((data) => setBookings(data))

    const loadSnapshot = async () => {
      if (isActive) {
        setIsLoading(true)
      }

      try {
        // TODO: Replace mock API with real
        const data = await fetchDashboardSnapshot()
        if (!isActive) {
          return
        }

        setSnapshot(data)
        setError(null)
      } catch (err) {
        console.error("Failed to load dashboard snapshot", err)
        if (!isActive) {
          return
        }

        setError("We couldn't fetch the latest data. Showing cached values.")
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadSnapshot()

    return () => {
      isActive = false
    }
  }, [])

  // const bookings = useMemo(() => snapshot?.bookings ?? [], [snapshot])
  const hasSnapshot = snapshot != null

  const { upcomingSubtitle, upcomingHighlight } = useMemo(() => {
    if (isLoading) {
      return {
        upcomingSubtitle: "Next: Loading...",
        upcomingHighlight: hasSnapshot
          ? `${bookings.length} ${bookings.length === 1 ? "booking" : "bookings"}`
          : "Loading...",
      }
    }

    const nextBooking = bookings[0]
    return {
      upcomingSubtitle: nextBooking
        ? `Next: ${formatDateTime(nextBooking.date)}`
        : "Next: No bookings scheduled",
      upcomingHighlight: `${bookings.length} ${bookings.length === 1 ? "booking" : "bookings"}`,
    }
  }, [bookings, hasSnapshot, isLoading])

  const { revenueAmount, revenueCaption } = useMemo(() => {
    if (!snapshot) {
      return {
        revenueAmount: isLoading ? "Loading..." : "—",
        revenueCaption: isLoading ? "Updating..." : "No change data yet",
      }
    }

    const { amount, currency, changePercentage } = snapshot.revenue
    return {
      revenueAmount: formatCurrency(amount, currency),
      revenueCaption:
        changePercentage != null
          ? `${changePercentage >= 0 ? "+" : ""}${changePercentage}% vs last month`
          : isLoading
            ? "Updating..."
            : "No change data yet",
    }
  }, [isLoading, snapshot])

  const handleOpenModal = useCallback(() => setIsModalOpen(true), [])

  const handleCloseModal = useCallback(() => setIsModalOpen(false), [])

  const handleOverlayClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        handleCloseModal()
      }
    },
    [handleCloseModal],
  )

  const handleStartBooking = useCallback(() => {
    navigate("/services")
  }, [navigate])

  return (
    <main id="dashboard">
      <Navbar />
      <div className="dashboard">
        <div className="statsGrid">
          <Card title="Upcoming" subtitle={upcomingSubtitle}>
            <div className="highlightBlock">
              <span className="highlightValue">{upcomingHighlight}</span>
            </div>
          </Card>
          {user.type === "caretaker" && (
            <Card title="This month" subtitle="Revenue">
              <div className="highlightBlock">
                <span className="highlightValue">{revenueAmount}</span>
                <span className="highlightCaption">{revenueCaption}</span>
              </div>
            </Card>
          )}
        </div>

        <div className="wideGrid">
          <Card
            title="Book"
            subtitle="Select service, date & time."
            description="Start a new booking for grooming, walks, or visits."
            action={
              <HoverButton
                label="Get started"
                icon={<ChevronRight aria-hidden="true" strokeWidth={1.8} />}
                onClick={handleStartBooking}
              />
            }
            icon={<CalendarPlus strokeWidth={1.8} aria-hidden="true" />}
          />

          <Card
            title="View bookings"
            subtitle="See upcoming & past appointments."
            icon={<CalendarCheck2 strokeWidth={1.8} aria-hidden="true" />}
          >
            <BookingList
              bookings={bookings}
              isLoading={isLoading}
              limit={3}
              containerClassName="list"
              rowClassName="listRow"
              textClassName="listText"
            />
            {error ? (
              <p className="errorText" role="status">
                {error}
              </p>
            ) : null}
            <button
              type="button"
              className="secondaryLink secondaryLinkButton"
              onClick={handleOpenModal}
            >
              <span className="secondaryLinkText">Open list</span>
              <ChevronRight aria-hidden="true" strokeWidth={1.8} className="secondaryLinkIcon" />
            </button>
          </Card>
        </div>

        <Card
          title="Need help?"
          subtitle="Frequently asked questions and contact options."
          action={
            <div className="needHelp">
              <p className="needHelpText">Still stuck? We&apos;re here to help.</p>
              <a href="#faqs" className="secondaryLink">
                <span className="secondaryLinkText">FAQs</span>
                <ChevronRight aria-hidden="true" strokeWidth={1.8} className="secondaryLinkIcon" />
              </a>
            </div>
          }
          icon={<Info strokeWidth={1.8} aria-hidden="true" />}
        />
        {isModalOpen ? (
          <div
            className="modalOverlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="allBookingsTitle"
            onClick={handleOverlayClick}
          >
            <div className="modalContent">
              <header className="modalHeader">
                <h2 id="allBookingsTitle">All bookings</h2>
                <button
                  type="button"
                  className="modalCloseButton"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <X aria-hidden="true" strokeWidth={1.8} />
                </button>
              </header>
              <div className="modalBody">
                <BookingList
                  bookings={bookings}
                  isLoading={isLoading}
                  containerClassName="modalList"
                  rowClassName="modalListRow"
                  textClassName="modalListText"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}

export default Dashboard
