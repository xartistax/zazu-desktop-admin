// Ladeanzeige bei Navigationen innerhalb des Panels: Die Suspense-Grenze im
// Layout greift nur beim direkten Aufruf, nicht beim Wechsel zwischen Seiten.
export default function Loading() {
  return <p className="text-sm text-muted-foreground">Laden …</p>
}
