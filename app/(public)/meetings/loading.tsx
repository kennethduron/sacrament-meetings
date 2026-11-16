export default function MeetingsLoading() {
  return (
    <div aria-live="polite" className="status-panel" role="status">
      <span aria-hidden="true" className="loading-dot" />
      Loading meeting information…
    </div>
  );
}
