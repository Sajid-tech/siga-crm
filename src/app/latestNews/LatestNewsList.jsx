import React, { useState } from 'react'
import Page from '../dashboard/page'
import BASE_URL from '@/config/BaseUrl';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Loader2,
  FilePlus,
  FilePenLine,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
const LatestNewsList = () => {
    const {
        data: registrations,
        isLoading,
        isError,
        refetch,
      } = useQuery({
        queryKey: ["registrations"],
        queryFn: async () => {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${BASE_URL}/api/panel-fetch-news-list`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.data.news;
        },
      });
    
      // State for table management
      const [sorting, setSorting] = useState([]);
      const [columnFilters, setColumnFilters] = useState([]);
      const [columnVisibility, setColumnVisibility] = useState({});
      const [rowSelection, setRowSelection] = useState({});
      const navigate = useNavigate()
      // Define columns for the table
      const columns = [
        
        {
          accessorKey: "id",
          header: "ID",
          cell: ({ row }) => <div>{row.getValue("id")}</div>,
        },
        {
          accessorKey: "news_heading",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              News Heading
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("news_heading")}</div>,
        },
        {
          accessorKey: "news_sub_title",
          header: "Subtitle",
          cell: ({ row }) => <div>{row.getValue("news_sub_title")}</div>,
        },
        
        {
          id: "actions",
          header: "Action",
          cell: ({ row }) => {
            const registration = row.original.id;
    
            return (
                <>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/create-news`) }
              >
                <FilePlus  className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/edit-news/${registration}`) }
              >
                <FilePenLine  className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  // Implement view details functionality
                  console.log("View registration details:", registration);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              </>
            );
          },
        },
      ];
    
      // Create the table instance
      const table = useReactTable({
        data: registrations || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
          sorting,
          columnFilters,
          columnVisibility,
          rowSelection,
        },
        initialState: {
          pagination: {
            pageSize: 7,
          },
        },
      });
    
      // Render loading state
      if (isLoading) {
        return (
          <Page>
            <div className="flex justify-center items-center h-full">
              <Button disabled>
                <Loader2 className=" h-4 w-4 animate-spin" />
                Loading News List
              </Button>
            </div>
          </Page>
        );
      }
    
      // Render error state
      if (isError) {
        return (
          <Page>
            <Card className="w-full max-w-md mx-auto mt-10">
              <CardHeader>
                <CardTitle className="text-destructive">
                  Error Fetching News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </Page>
        );
      }
  return (
    <Page>
          <div className="w-full p-4">
        <div className="flex text-left text-xl text-gray-800 font-[400]" >Latest News List</div>
        {/* searching and column filter  */}
        <div className="flex items-center py-4">
        <Input
              placeholder="Search..."
              value={table.getState().globalFilter || ""}
              onChange={(event) => {
                table.setGlobalFilter(event.target.value);
              }}
              className="max-w-sm"
            />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* table  */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* row slection and pagintaion button  */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Page>
   
  )
}

export default LatestNewsList