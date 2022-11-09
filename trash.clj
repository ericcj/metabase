
(-> the-card :visualization_settings :pivot_table.column_split)
;; =>
{:rows [[:field 50 {:source-field 43}] [:field 41 {:temporal-unit :year}]],
 :columns [[:field 63 {:source-field 36}]],
 :values [[:aggregation 0]]}

(-> the-card qp.pivot/run-pivot-query :data :cols)
;; =>
({:description "The date and time an order was submitted.",
  :semantic_type :type/CreationTimestamp,
  :table_id 2,
  :coercion_strategy nil,
  :unit :year,
  :name "CREATED_AT",
  :settings nil,
  :source :breakout,
  :field_ref [:field 41 {:temporal-unit :year}],
  :effective_type :type/DateTime,
  :nfc_path nil,
  :parent_id nil,
  :id 41,
  :visibility_type :normal,
  :display_name "Created At",
  :fingerprint
  {:global {:distinct-count 9998, :nil% 0.0},
   :type #:type{:DateTime {:earliest "2016-04-30T18:56:13.352Z", :latest "2020-04-19T14:07:15.657Z"}}},
  :base_type :type/DateTime}
 {:description "The type of product, valid values include: Doohicky, Gadget, Gizmo and Widget",
  :semantic_type :type/Category,
  :table_id 1,
  :coercion_strategy nil,
  :name "CATEGORY",
  :settings nil,
  :source :breakout,
  :fk_field_id 36,
  :field_ref [:field 63 {:source-field 36}],
  :effective_type :type/Text,
  :nfc_path nil,
  :parent_id nil,
  :id 63,
  :visibility_type :normal,
  :display_name "Product → Category",
  :fingerprint
  {:global {:distinct-count 4, :nil% 0.0},
   :type
   #:type{:Text
          {:percent-json 0.0, :percent-url 0.0, :percent-email 0.0, :percent-state 0.0, :average-length 6.375}}},
  :base_type :type/Text,
  :source_alias "PRODUCTS__via__PRODUCT_ID"}
 {:description "The state or province of the account’s billing address",
  :semantic_type :type/State,
  :table_id 5,
  :coercion_strategy nil,
  :name "STATE",
  :settings nil,
  :source :breakout,
  :fk_field_id 43,
  :field_ref [:field 50 {:source-field 43}],
  :effective_type :type/Text,
  :nfc_path nil,
  :parent_id nil,
  :id 50,
  :visibility_type :normal,
  :display_name "User → State",
  :fingerprint
  {:global {:distinct-count 49, :nil% 0.0},
   :type
   #:type{:Text {:percent-json 0.0, :percent-url 0.0, :percent-email 0.0, :percent-state 1.0, :average-length 2.0}}},
  :base_type :type/Text,
  :source_alias "PEOPLE__via__USER_ID"}
 {:base_type :type/Integer,
  :name "pivot-grouping",
  :display_name "pivot-grouping",
  :expression_name "pivot-grouping",
  :field_ref [:expression "pivot-grouping"],
  :source :breakout,
  :effective_type :type/Integer}
 {:base_type :type/Float,
  :semantic_type nil,
  :settings nil,
  :name "sum",
  :display_name "Sum of Subtotal",
  :source :aggregation,
  :field_ref [:aggregation 0],
  :effective_type :type/Float})


(magic-function *1 *2)
;; =>
{
 :rows [2, 0]
 :columns [1]
 :aggregates [4]
}
