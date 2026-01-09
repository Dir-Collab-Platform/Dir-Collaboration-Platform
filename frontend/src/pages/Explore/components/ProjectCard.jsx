import { Star, Workflow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GithubIcon } from '../../../../public/assets/icons/icons';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (project.isImported) {
      navigate(`/workspace/${project._id}`);
    } else {
      navigate(`/repository/${project._id}`);
    }
  };

  return (
    <div
      className="p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--main-border-color)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary-button-active)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--main-border-color)';
      }}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className='flex gap-2 justify-center items-center'>
          <h3 className="flex items-center gap-2 font-bold text-[22px]" style={{ color: 'var(--primary-text-color)' }}>
            {project.isImported && <Workflow size={20} className="text-(--primary-text-color)" />}
            {project.workspaceName || project.githubRepoName}
          </h3>
          <span
            className='px-2 py-0.5 rounded-[34px] text-[12px]'
            style={{
              backgroundColor: 'var(--meta-tag-color)',
              color: 'var(--secondary-text-color)'
            }}
          >
            {project.visibility || (project.isPrivate ? "private" : "public")}
          </span>
        </div>
        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--secondary-text-color)' }}>
          <Star size={16} />
          {project.stars || 0}
          <GithubIcon className="w-4 h-4" />
        </span>
      </div>

      <div className='flex items-center gap-3 mb-2'>
        <h4 className='font-semibold text-[20px]' style={{ color: 'var(--mid-dim-font-color)' }}>
          {project.githubOwner}
        </h4>
        <button
          className='px-2 py-0.5 rounded-[34px] text-[12px]'
          style={{
            backgroundColor: 'var(--meta-tag-color)',
            color: 'var(--secondary-text-color)'
          }}
        >
          Owner
        </button>
      </div>

      <p className="text-sm font-light mb-4" style={{ color: 'var(--primary-text-color)' }}>
        {project.description || "No description available"}
      </p>

      {project.languages && project.languages.length > 0 && (
        <div className="mb-4">
          <div className="h-2 rounded overflow-hidden flex" style={{ backgroundColor: 'var(--secondary-button)' }}>
            {project.languages.map((lang) => (
              <div
                key={lang.label}
                className="h-full transition-all hover:opacity-80"
                style={{
                  width: `${lang.value}%`,
                  backgroundColor: lang.color || '#6b7280',
                }}
                title={`${lang.label}: ${lang.value.toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.languages.map((lang) => (
              <div key={lang.label} className="flex items-center gap-2 text-xs">
                <div
                  className="w-2 h-2 rounded"
                  style={{ backgroundColor: lang.color || '#6b7280' }}
                />
                <span style={{ color: 'var(--mid-dim-font-color)' }}>{lang.label}</span>
                <span style={{ color: 'var(--secondary-text-color)' }}>{lang.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className='font-semibold text-[12px] mb-2' style={{ color: 'var(--primary-text-color)' }}>Collaborators</h3>
      <div className="flex -space-x-2">
        {project.collaborators && project.collaborators.length > 0 ? (
          project.collaborators.map((avatar, i) => (
            <img
              key={i}
              src={avatar}
              className="w-7 h-7 rounded-full border-2"
              style={{ borderColor: 'var(--dark-bg)' }}
              alt="collaborator"
            />
          ))
        ) : (
          <img
            src={project.avatar || "https://via.placeholder.com/40"}
            className="w-7 h-7 rounded-full border-2"
            style={{ borderColor: 'var(--dark-bg)' }}
            alt="owner"
          />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
