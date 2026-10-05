using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AlignProductReviewAggregates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE product
                SET product.ReviewCount = COALESCE(reviewStats.ReviewCount, 0),
                    product.Rating = COALESCE(reviewStats.AverageRating, 0)
                FROM Products AS product
                LEFT JOIN (
                    SELECT ProductId, COUNT(*) AS ReviewCount, AVG(CAST(Rating AS float)) AS AverageRating
                    FROM Reviews
                    GROUP BY ProductId
                ) AS reviewStats ON reviewStats.ProductId = product.Id;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
