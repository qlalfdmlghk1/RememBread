//@/constants/time

export const AMPM = ["오전", "오후"] as const;

export const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));

// export const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

export const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0"));