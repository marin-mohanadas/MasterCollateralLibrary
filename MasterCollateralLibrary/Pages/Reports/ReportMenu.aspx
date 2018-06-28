<%@ Page Title="" Language="C#" MasterPageFile="~/Pages/Reports/Reports.Master" AutoEventWireup="true" CodeBehind="ReportMenu.aspx.cs" Inherits="MasterCollateralLibrary.Pages.Reports.ReportMenu" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="../../Content/bootstrap.css" rel="stylesheet" />
    <div class="row">
    <div class="col-md-6">
        <h2>Current Reports <br /><asp:Label runat="server" ID="RepInfo" Visible="false"></asp:Label></h2>
        <p>
            <ul class="list-group">
                <asp:Label runat="server" ID="reports"></asp:Label>

            </ul>
            <asp:GridView ID="GridView1" runat="server"></asp:GridView>
        </p>
    </div>
</div>
</asp:Content>
