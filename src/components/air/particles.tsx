const particles = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 4 + ((i * 7) % 10),
  delay: (i % 9) * 1.1,
  duration: 7 + ((i * 3) % 7),
  top: 20 + ((i * 13) % 70),
}));

export function ParticleField({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute -left-24 top-10 h-64 w-[36rem] rounded-full bg-primary/12 blur-3xl animate-drift-cloud" />
      <div className="absolute -right-24 top-40 h-72 w-[40rem] rounded-full bg-accent/14 blur-3xl animate-drift-cloud" />
      <div className="absolute left-1/3 -top-10 h-56 w-[30rem] rounded-full bg-primary/10 blur-3xl animate-drift-cloud" />
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary/40 animate-float-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
