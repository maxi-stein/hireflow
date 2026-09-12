import { Table, Badge, ActionIcon, Text, Group } from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { JobOfferStatus, type JobOffer } from '../../../services/job-offer.service';
import { getWorkModeColor } from '../../../utils/job.utils';

interface JobPostingsTableProps {
  jobOffers: JobOffer[];
  isLoading: boolean;
  onViewClick: (offer: JobOffer) => void;
  onEditClick: (offerId: string) => void;
  onDeleteClick: (offer: JobOffer) => void;
}

export function JobPostingsTable({
  jobOffers,
  isLoading,
  onViewClick,
  onEditClick,
  onDeleteClick,
}: JobPostingsTableProps) {
  const { t, i18n } = useTranslation('jobs');

  const tableHeaders = [
    { title: t('list.table.position'), accessorKey: "position" },
    { title: t('list.table.workMode'), accessorKey: "work_mode" },
    { title: t('list.table.applicants'), accessorKey: "applicants_count" },
    { title: t('list.table.status'), accessorKey: "status" },
    { title: t('list.table.posted'), accessorKey: "created_at" },
    { title: t('list.table.deadline'), accessorKey: "deadline" },
    { title: t('list.table.actions'), accessorKey: "actions" },
  ];

  return (
    <Table verticalSpacing="xl" horizontalSpacing="xl" highlightOnHover style={{ paddingLeft: "120px" }}>
      <Table.Thead>
        <Table.Tr>
          {tableHeaders.map((header) => (
            <Table.Th key={header.accessorKey}>{header.title}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {jobOffers.map((offer) => (
          <Table.Tr key={offer.id}>
            <Table.Td>
              <Text fw={500}>{offer.position}</Text>
            </Table.Td>
            <Table.Td>
              <Badge variant="light" color={getWorkModeColor(offer.work_mode)}>
                {t(`workMode.${offer.work_mode}`)}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Text size="sm" ta="center">{offer.applicants_count}</Text>
            </Table.Td>
            <Table.Td>
              <Badge
                color={offer.status === JobOfferStatus.OPEN ? 'green' : 'red'}
                variant="light"
              >
                {offer.status === JobOfferStatus.OPEN ? t('status.open') : t('status.closed')}
              </Badge>
            </Table.Td>
            <Table.Td>
              {new Date(offer.created_at).toLocaleDateString(i18n.language)}
            </Table.Td>
            <Table.Td>
              {offer.deadline ? new Date(offer.deadline).toLocaleDateString(i18n.language) : '-'}
            </Table.Td>
            <Table.Td>
              <Group gap={4} wrap="nowrap">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => onViewClick(offer)}
                >
                  <IconEye size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  onClick={() => onEditClick(offer.id)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => onDeleteClick(offer)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
        {!isLoading && jobOffers.length === 0 && (
          <Table.Tr>
            <Table.Td colSpan={7} style={{ textAlign: 'center' }}>
              <Text c="dimmed" py="xl">{t('list.empty')}</Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
}
