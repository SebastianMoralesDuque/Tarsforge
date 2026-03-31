export default function Spinner({ color = 'var(--neon-green)', size = 20 }) {
    return (
        <span
            className="inline-block rounded-full border-2 border-current border-t-transparent"
            style={{
                width: size,
                height: size,
                borderColor: `${color} ${color} ${color} transparent`,
                animation: 'spin 0.8s linear infinite',
                boxShadow: `0 0 8px ${color}60`,
            }}
        />
    );
}
