<%@ Page Title="" Language="C#" MasterPageFile="~/Pages/Reports/Reports.Master" AutoEventWireup="true" CodeBehind="ReportRunner.aspx.cs" Inherits="MasterCollateralLibrary.Pages.Reports.ReportRunner" %>

<%@ Register Assembly="Telerik.Web.UI" Namespace="Telerik.Web.UI" TagPrefix="telerik" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:Panel ID="Panel1" runat="server" Visible="false"></asp:Panel>
    <telerik:RadAjaxManagerProxy ID="RadAjaxManagerProxy1" runat="server">
        <AjaxSettings>
            <telerik:AjaxSetting AjaxControlID="RadGrid1">
                <UpdatedControls>
                    <telerik:AjaxUpdatedControl ControlID="RadGrid1" UpdatePanelHeight="100%" UpdatePanelCssClass="" />
                </UpdatedControls>
            </telerik:AjaxSetting>
        </AjaxSettings>
    </telerik:RadAjaxManagerProxy>
    <telerik:RadFormDecorator ID="RadFormDecorator1" runat="server" DecoratedControls="All" />
    <telerik:RadPersistenceManagerProxy ID="RadPersistenceManagerProxy1" runat="server" UniqueKey="">
        <PersistenceSettings>
            <telerik:PersistenceSetting ControlID="RadGrid1" />
        </PersistenceSettings>
    </telerik:RadPersistenceManagerProxy>
<%--    <div class="PVTButton">
        <telerik:RadButton ID="RadButton1" runat="server" Text="Goto Pivot Table View"></telerik:RadButton>
        <telerik:RadButton ID="RadButton2" runat="server" Text="Large Export xlsx" ToolTip="Use this button if the data is more then 10,000 rows or you notice it taking a long time to export your report.  Note: All Filters are ignored."></telerik:RadButton>
    </div>--%>
    <telerik:RadGrid ID="ReportGrid" AllowFilteringByColumn="True" runat="server" FilterType="Combined"
        AllowPaging="True" 
        Height="100%" AllowSorting="True" EnableHeaderContextFilterMenu="True"
        ShowGroupPanel="false" EnableGroupsExpandAll="True" EnableHeaderContextMenu="True"
        EnableHierarchyExpandAll="True" ShowFooter="True" ShowStatusBar="True"
        PageSize="500" OnNeedDataSource="ReportGrid_NeedDataSource" OnInfrastructureExporting="ReportGrid_InfrastructureExporting"
        OnFilterCheckListItemsRequested="ReportGrid_FilterCheckListItemsRequested"
        EnableHeaderContextAggregatesMenu="True" OnColumnCreated="ReportGrid_ColumnCreated"
        FilterMenu-EnableAutoScroll="False" FilterMenu-EnableImageSprites="True" FilterMenu-EnableRootItemScroll="True"
        FilterMenu-EnableSelection="True" FilterMenu-EnableTextHTMLEncoding="True"
        FilterMenu-ShowToggleHandle="True" MasterTableView-AllowFilteringByColumn="True"
        MasterTableView-EnableGroupsExpandAll="True" MasterTableView-EnableHeaderContextAggregatesMenu="True"
        MasterTableView-EnableHeaderContextFilterMenu="True" MasterTableView-EnableHeaderContextMenu="True"
        MasterTableView-EnableHierarchyExpandAll="True" MasterTableView-RetrieveDataTypeFromFirstItem="True" PagerStyle-PageSizeControlType="RadComboBox" ClientSettings-AllowColumnHide="True"
        ClientSettings-AllowColumnsReorder="True" ClientSettings-AllowDragToGroup="True"
        ClientSettings-AllowKeyboardNavigation="True" ClientSettings-AllowRowsDragDrop="True"
        ClientSettings-EnableRowHoverStyle="True" FilterMenu-AppendDataBoundItems="True">
        <CommandItemStyle />
        <GroupingSettings CollapseAllTooltip="Collapse all groups"></GroupingSettings>

        <ExportSettings ExportOnlyData="True" IgnorePaging="True" Excel-Format="Xlsx" Word-Format="Docx" OpenInNewWindow="true">
            <Pdf DefaultFontFamily="Arial Unicode MS" PageTopMargin="45mm"
                BorderStyle="Medium" BorderColor="#666666">
            </Pdf>

            <Excel Format="Xlsx"></Excel>
        </ExportSettings>
        <HeaderStyle Wrap="false" />
        <ClientSettings AllowDragToGroup="false" Resizing-AllowColumnResize="true" AllowColumnHide="True" AllowColumnsReorder="True" AllowRowHide="True" AllowRowsDragDrop="True" ReorderColumnsOnClient="True" Animation-AllowColumnReorderAnimation="False" Animation-AllowColumnRevertAnimation="False" DataBinding-EnableCaching="True" Resizing-AllowResizeToFit="True" Resizing-EnableRealTimeResize="True" Scrolling-AllowScroll="False" Scrolling-SaveScrollPosition="True">
            <DataBinding EnableCaching="True"></DataBinding>

            <Scrolling AllowScroll="True" UseStaticHeaders="True" />

            <Resizing AllowColumnResize="True" EnableRealTimeResize="True" AllowResizeToFit="True"></Resizing>

        </ClientSettings>
        <MasterTableView CommandItemDisplay="Top" Width="100%" EnableGroupsExpandAll="True" EnableHeaderContextAggregatesMenu="True">
            <CommandItemSettings ShowAddNewRecordButton="False" ShowExportToCsvButton="True" ShowExportToExcelButton="True" ShowRefreshButton="True" ShowExportToPdfButton="True" ShowExportToWordButton="True" />
        </MasterTableView>
        <FilterMenu CssClass="RadFilterMenu_CheckList">
        </FilterMenu>
    </telerik:RadGrid>
</asp:Content>
