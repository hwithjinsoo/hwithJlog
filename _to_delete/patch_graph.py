# -*- coding: utf-8 -*-
import sys
path="app/components/CTFGraph.tsx"
c=open(path,encoding="utf-8").read()
orig=c

# import에 useEffect/useState 추가 (현재 recharts import만 있음)
old_imp='''import { Post } from "@/app/lib/posts";
import {'''
new_imp='''import { Post } from "@/app/lib/posts";
import { useEffect, useState } from "react";
import {'''
assert c.count(old_imp)==1, ("imp", c.count(old_imp))
c=c.replace(old_imp,new_imp,1)

# 컴포넌트 본문 시작부에 다크 감지 훅 + 색 변수 삽입
old_body='''export default function CTFGraph({ posts }: Props) {
  // 날짜별 카테고리별 카운트'''
new_body='''export default function CTFGraph({ posts }: Props) {
  // <html>의 .dark 클래스 감지 (토글 시 실시간 반영)
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    update();
    const mo = new MutationObserver(update);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  // 테마별 그래프 색
  const gridColor = dark ? "#3f3f46" : "#e4e4e7";
  const axisColor = dark ? "#a1a1aa" : "#71717a";
  const tooltipBg = dark ? "#27272a" : "#fff";
  const tooltipBorder = dark ? "#3f3f46" : "#e4e4e7";
  const tooltipLabel = dark ? "#e4e4e7" : "#000";

  // 날짜별 카테고리별 카운트'''
assert c.count(old_body)==1, ("body", c.count(old_body))
c=c.replace(old_body,new_body,1)

# CartesianGrid
c=c.replace('<CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />',
            '<CartesianGrid strokeDasharray="3 3" stroke={gridColor} />',1)
# XAxis
c=c.replace('<XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 10}} />',
            '<XAxis dataKey="date" stroke={axisColor} tick={{ fontSize: 10, fill: axisColor }} />',1)
# YAxis
c=c.replace('<YAxis stroke="#71717a" tick={{ fontSize: 12 }} allowDecimals={false} />',
            '<YAxis stroke={axisColor} tick={{ fontSize: 12, fill: axisColor }} allowDecimals={false} />',1)
# Tooltip
old_tt='''          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e4e4e7" }}
            labelStyle={{ color: "#000" }}
          />'''
new_tt='''          <Tooltip
            contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }}
            labelStyle={{ color: tooltipLabel }}
          />'''
assert c.count(old_tt)==1, ("tt", c.count(old_tt))
c=c.replace(old_tt,new_tt,1)

open(path,"w",encoding="utf-8").write(c)
print("graph OK", c!=orig)
