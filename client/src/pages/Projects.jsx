import { useState } from 'react';
import Button from '../components/Button';
import Container from '../components/Container';
import DataState from '../components/DataState';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import ProjectCard from '../components/ProjectCard';
import ProjectFilter from '../components/ProjectFilter';
import { useApi } from '../hooks/useApi';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { getProjects } from '../services/portfolioService';

export default function Projects() {
  const projects = useApi((signal) => getProjects(signal), []);
  const [tech, setTech] = useState(null);

  useDocumentMeta({
    title: 'Projects',
    description: 'Software and engineering projects with descriptions, technologies used, source code and demos.',
  });

  return (
    <>
      <PageHeader
        title="Projects"
        description="Things I've built, with the technologies behind them. Open a project for the full write-up."
      />

      <Container className="py-14">
        <DataState
          state={projects}
          label="projects"
          emptyTitle="No projects published yet"
          emptyMessage="Add rows to the projects table in Supabase to show them here."
        >
          {(items) => {
            const visible = tech ? items.filter((p) => p.tech_stack?.includes(tech)) : items;
            return (
              <>
                <ProjectFilter projects={items} selected={tech} onSelect={setTech} />
                {visible.length === 0 ? (
                  <EmptyState title={`No projects use ${tech}`}>
                    <Button variant="secondary" size="sm" onClick={() => setTech(null)}>
                      Show all projects
                    </Button>
                  </EmptyState>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visible.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </>
            );
          }}
        </DataState>
      </Container>
    </>
  );
}
