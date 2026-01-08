export const PROJECT_PERMISSIONS = {
  owner: {
    canEditProject: true,
    canDeleteProject: true,
    canManageMembers: true,
    canManageManagers: true,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: true,
    canChangeTaskStatus: true,
  },

  manager: {
    canEditProject: true,
    canDeleteProject: false,
    canManageMembers: true,
    canManageManagers: false,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: true,
    canChangeTaskStatus: true,
  },

  member: {
    canEditProject: false,
    canDeleteProject: false,
    canManageMembers: false,
    canManageManagers: false,
    canCreateTask: true,
    canEditTask: false,
    canDeleteTask: false,
    canChangeTaskStatus: true,
  },
};
