import { NavLink, Stack } from '@mantine/core';
import { useLocation } from 'react-router-dom';

// Mock Role for now - in real app this comes from AuthContext
const USER_ROLE: string = 'candidate'; // 'candidate' | 'employee'

export function SideNav() {
  const location = useLocation();
  const active = location.pathname;

  const candidateLinks = [
    { label: 'Mi Perfil', link: '/my-profile', icon: '👤' },
    { label: 'Mis Postulaciones', link: '/my-applications', icon: '📄' },
    { label: 'Ofertas Guardadas', link: '/saved-offers', icon: '🔖' },
  ];

  const employeeLinks = [
    { label: 'Dashboard', link: '/dashboard', icon: '📊' },
    { label: 'Gestionar Ofertas', link: '/manage-jobs', icon: '💼' },
    { label: 'Buscar Candidatos', link: '/candidates', icon: '🔍' },
    { label: 'Entrevistas', link: '/interviews', icon: '📅' },
  ];

  const links = USER_ROLE === 'employee' ? employeeLinks : candidateLinks;

  return (
    <Stack gap="xs" p="md">
      {links.map((item) => (
        <NavLink
          key={item.label}
          label={item.label}
          leftSection={<span>{item.icon}</span>}
          href={item.link}
          active={active === item.link}
          variant="light"
        />
      ))}
    </Stack>
  );
}
