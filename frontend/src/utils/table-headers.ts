type Props = "job-offers" | "candidates";

export const getTableHeaders = (type: Props) => {
  switch (type) {
    case "job-offers":
      return [
        { title: "Position", accessorKey: "position" },
        { title: "Location", accessorKey: "location" },
        { title: "Work Mode", accessorKey: "work_mode" },
        { title: "Applicants", accessorKey: "applicants_count" },
        { title: "Status", accessorKey: "status" },
        { title: "Posted Date", accessorKey: "created_at" },
        { title: "Deadline", accessorKey: "deadline" },
      ];
    case "candidates":
      return [
        { title: "Name", accessorKey: "name" },
        { title: "Email", accessorKey: "email" },
        { title: "Phone", accessorKey: "phone" },
        { title: "Status", accessorKey: "status" },
        { title: "Created At", accessorKey: "created_at" },
      ];
  }
};
