/**
 * @author Echo009
 * @since 2026-08-20
 */
export interface Project {
  /** 项目名（保留仓库原名） */
  name: string;
  /** HUD 风格英文标签 */
  tagline: string;
  /** 中文一两句描述 */
  description: string;
  /** 技术标签 */
  tech: string[];
  /** 仓库地址 */
  link: string;
  /** 可选强调色（CSS 变量或色值），缺省四色循环 */
  accent?: string;
}

export const projects: Project[] = [
  {
    name: 'PowerJob',
    tagline: 'CORE_MAINTAINER',
    description: '核心维护者（贡献排名第二，101 commits，2021-2023）：主导嵌套工作流、决策节点、轻量级任务模型、SQL 处理器等核心特性，负责 4.x 版本迭代与 PR 合并。',
    tech: ['Java', 'Akka', 'Spring Boot', 'Distributed Systems'],
    link: 'https://github.com/PowerJob/PowerJob',
  },
];
