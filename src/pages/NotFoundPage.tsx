import { Link } from 'react-router-dom'
import LiquidGlassCard from '../components/liquidglass/LiquidGlassCard'

function NotFoundPage() {
  return (
    <LiquidGlassCard className="space-y-4 p-6 text-center">
      <h1 className="text-2xl font-semibold text-slate-50">Page not found</h1>
      <p className="text-slate-300">The page you requested does not exist.</p>
      <Link className="button mx-auto w-fit" to="/">
        Go home
      </Link>
    </LiquidGlassCard>
  )
}

export default NotFoundPage
