"""Eliminar columna sowing_date de fields

Revision ID: 6c74df80aa8a
Revises: afd911e2593a
Create Date: 2025-04-14 09:46:12.236934

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6c74df80aa8a'
down_revision = 'afd911e2593a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('fields', schema=None) as batch_op:
        batch_op.drop_column('sowing_date')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('fields', schema=None) as batch_op:
        batch_op.add_column(sa.Column('sowing_date', sa.DATE(), autoincrement=False, nullable=False))

    # ### end Alembic commands ###
