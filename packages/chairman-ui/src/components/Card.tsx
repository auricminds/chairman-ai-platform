import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Card({ children, className = "", as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={[
        "bg-zinc-900 border border-zinc-800 rounded-lg",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["px-6 py-4 border-b border-zinc-800", className].join(" ")}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["px-6 py-4", className].join(" ")}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["px-6 py-4 border-t border-zinc-800", className].join(" ")}>
      {children}
    </div>
  );
}
