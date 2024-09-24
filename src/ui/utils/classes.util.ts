import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
 

export function classes(...args: any[]) {
  return args.filter((a) => !!a).join(" ");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}