"use client";

import { useState, useEffect } from "react";

export default function ClientDate({ isoDate }: { isoDate: string }) {
  const [display, setDisplay] = useState<string>("");
  useEffect(() => {
    setDisplay(new Date(isoDate).toLocaleDateString());
  }, [isoDate]);
  return <span>{display}</span>;
}
