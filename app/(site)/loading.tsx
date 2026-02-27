export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-sand border-t-espresso rounded-full animate-spin" />
        <p className="font-sans text-xs text-espresso/30 tracking-widest uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}
