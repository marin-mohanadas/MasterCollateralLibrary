<%@ Page Title="" Language="C#" MasterPageFile="~/Pages/Reports/Reports.Master" AutoEventWireup="true" CodeBehind="QuoteComparison.aspx.cs" Inherits="MasterCollateralLibrary.Pages.Reports.QuoteComparison" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style type="text/css">
        .auto-style1 {
            height: 23px;
        }
      .ClassA
      {
          background-color: #FFFF99 ;
      }
      .ClassB
      {
           background-color: #FFFFCC ;
      }
    </style>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../../Content/bootstrap.css" rel="stylesheet" />
    <table style="width:50%;">
        <tr>
            <td class="auto-style1">Base Quote</td>
            <td class="auto-style1">Comparison Quote</td>
            <td class="auto-style1">&nbsp;</td>
        </tr>
        <tr>
            <td>
    <telerik:RadDropDownList ID="Quote1_var" runat="server">
    </telerik:RadDropDownList>
            </td>
            <td>
    <telerik:RadDropDownList ID="Quote2_var" runat="server">
    </telerik:RadDropDownList>
            </td>
            <td>
                <telerik:RadButton ID="RunComp" runat="server" Text="GO!" OnClick="RunComp_Click">
                </telerik:RadButton>
            </td>
        </tr>
        </table>
    <telerik:RadGrid ID="RadGrid1" runat="server" OnItemDataBound="RadGrid1_ItemDataBound" ExportSettings-HideStructureColumns="true" OnNeedDataSource="RadGrid1_NeedDataSource">
        
<GroupingSettings CollapseAllTooltip="Collapse all groups"></GroupingSettings>
        <ExportSettings FileName="QuoteComparison">
            <Excel FileExtension="xlsx" Format="Xlsx" />
        </ExportSettings>
        <MasterTableView AllowFilteringByColumn="True" AllowSorting="True" CommandItemDisplay="Top">
            <CommandItemSettings ShowAddNewRecordButton="False" ShowExportToExcelButton="True" />
        </MasterTableView>
        
    </telerik:RadGrid>
</asp:Content>
