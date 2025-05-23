"""Add created_at to Quote model

Revision ID: 36d812bf64e4
Revises: 3d59ce29b02a
Create Date: 2025-04-11 10:50:00.556790

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '36d812bf64e4'
down_revision = '3d59ce29b02a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('quotes', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('quotes', schema=None) as batch_op:
        batch_op.drop_column('created_at')

    # ### end Alembic commands ###
